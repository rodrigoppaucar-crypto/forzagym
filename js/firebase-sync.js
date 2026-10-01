/**
 * FORZAGYM - FIREBASE CLOUD REAL-TIME SYNCHRONIZATION ENGINE
 * Seamless multi-device real-time sync with offline fallback and auto-reconnect.
 */

const FIREBASE_CONFIG_KEY = 'FORZAGYM_FIREBASE_CONFIG';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBF1mW2WR9jbR5L8KsW5GfOTFfk5ECxXsI",
  authDomain: "forzagym-cloud.firebaseapp.com",
  projectId: "forzagym-cloud",
  storageBucket: "forzagym-cloud.firebasestorage.app",
  messagingSenderId: "187661759618",
  appId: "1:187661759618:web:e6fe2667eb1760c5f2b09b",
  measurementId: "G-KPSRW4JQ5M"
};

class FirebaseSync {
  constructor() {
    this.app = null;
    this.firestore = null;
    this.unsubscribeListener = null;
    this.isConnected = false;
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.docRef = null;
  }

  // Load stored credentials or default to production Firebase config
  getConfig() {
    try {
      const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read Firebase config from storage:", e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  }

  saveConfig(config) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error("Error saving Firebase config:", e);
      return false;
    }
  }

  init() {
    const config = this.getConfig();
    if (!config || !config.apiKey || !config.projectId) {
      this.updateStatusUI('disconnected', 'Modo Local');
      return false;
    }
    return this.connect(config);
  }

  connect(config) {
    if (typeof firebase === 'undefined') {
      console.warn("Firebase SDK is not loaded yet.");
      this.updateStatusUI('error', 'Librería Firebase no cargada');
      return false;
    }

    try {
      // Unsubscribe previous listener if any
      if (this.unsubscribeListener) {
        this.unsubscribeListener();
        this.unsubscribeListener = null;
      }

      // Initialize or reuse Firebase App
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(config);
      } else {
        this.app = firebase.app();
      }

      this.firestore = firebase.firestore();
      
      // Enable persistence if available
      try {
        this.firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
          // Persistence may fail if multiple tabs are already opened or unsupported
          console.log("Firestore persistence note:", err.code);
        });
      } catch (e) {
        // Ignored
      }

      this.docRef = this.firestore.collection('forzagym_cloud').doc(config.projectId || 'main_database');
      
      this.updateStatusUI('connecting', 'Conectando a Firebase...');
      this.startRealtimeListener();
      return true;
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      this.isConnected = false;
      this.updateStatusUI('error', `Error: ${e.message || 'Configuración inválida'}`);
      return false;
    }
  }

  // Real-time listener across all devices
  startRealtimeListener() {
    if (!this.docRef) return;

    this.unsubscribeListener = this.docRef.onSnapshot((doc) => {
      this.isConnected = true;
      this.lastSyncTime = new Date();

      if (doc.exists) {
        const cloudData = doc.data();
        if (cloudData && cloudData.payload) {
          // Apply cloud data to local DB without re-triggering recursive cloud push
          if (window.GymDB) {
            window.GymDB.applyCloudData(cloudData.payload, cloudData.updatedAt);
          }
          this.updateStatusUI('connected', 'Sincronizado en Vivo 🟢');
        }
      } else {
        // First time cloud initialization: upload initial local data to Firestore
        console.log("Creating initial cloud database document...");
        this.pushFullLocalData();
        this.updateStatusUI('connected', 'Base creada en la nube 🟢');
      }
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      this.isConnected = false;
      this.updateStatusUI('error', `Error de conexión: ${error.message || 'Sin acceso'}`);
    });
  }

  // Push local data to Firestore
  async pushData(data) {
    if (!this.firestore || !this.docRef || !this.isConnected) return;
    if (this.isSyncing) return; // Prevent loops

    try {
      this.isSyncing = true;
      this.updateStatusUI('syncing', 'Sincronizando cambios...');
      
      const payload = {
        payload: data,
        updatedAt: new Date().toISOString(),
        updatedBy: window.GymDB && window.GymDB.currentUser ? window.GymDB.currentUser.name : 'Terminal'
      };

      await this.docRef.set(payload, { merge: true });
      this.lastSyncTime = new Date();
      this.updateStatusUI('connected', 'Sincronizado en Vivo 🟢');
    } catch (e) {
      console.error("Error pushing data to Firebase:", e);
      this.updateStatusUI('error', 'Error al sincronizar con la nube');
    } finally {
      this.isSyncing = false;
    }
  }

  // Upload full local dataset to cloud
  async pushFullLocalData() {
    if (!window.GymDB || !this.docRef) return false;
    return this.pushData(window.GymDB.data);
  }

  // Update UI indicators
  updateStatusUI(state, message) {
    const badge = document.getElementById('cloud-sync-status-badge');
    const dot = document.getElementById('cloud-status-dot');
    const text = document.getElementById('cloud-status-text');
    const settingsStatus = document.getElementById('settings-cloud-status-msg');

    if (badge) {
      badge.className = `cloud-sync-badge status-${state}`;
    }

    if (dot) {
      dot.style.background = state === 'connected' ? 'var(--accent)' : (state === 'connecting' || state === 'syncing' ? 'var(--warning)' : 'var(--secondary)');
    }

    if (text) {
      text.textContent = message || (state === 'connected' ? 'En Vivo' : 'Local');
    }

    if (settingsStatus) {
      settingsStatus.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: ${state === 'connected' ? 'var(--accent)' : (state === 'error' ? 'var(--secondary)' : 'var(--warning)')};">
          <i class="fa-solid ${state === 'connected' ? 'fa-cloud-circle-check' : (state === 'error' ? 'fa-cloud-circle-exclamation' : 'fa-cloud-arrow-up')}"></i>
          <span>${message}</span>
        </div>
      `;
    }
  }
}

// Global Singleton
window.GymFirebaseSync = new FirebaseSync();
