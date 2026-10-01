/**
 * PULSE GYM PRO - DATA LAYER & PERSISTENCE ENGINE
 * High-performance state store with LocalStorage backup, Seed Data & CRUD actions.
 */

const DB_KEY = 'FORZAGYM_DATA_V1';

const INITIAL_DATA = {
  settings: {
    gymName: "ForzaGym",
    slogan: "Centro de Entrenamiento & Fitness Club",
    taxId: "RUC: 1792348590001",
    phone: "+593 99 876 5432",
    email: "contacto@forzagym.com",
    address: "Pallatanga, Chimborazo, Ecuador",
    currency: "$",
    taxRate: 15,
    maxCapacity: 120,
    ticketFooter: "¡Gracias por entrenar con nosotros! Rompe tus límites en ForzaGym."
  },
  cashRegister: {
    isOpen: true,
    openedAt: new Date().toISOString(),
    initialCash: 150.00,
    currentCash: 385.50
  },
  memberships: [
    {
      id: "plan_1",
      name: "Pase Diario VIP",
      price: 6.00,
      durationDays: 1,
      benefits: ["Acceso a sala de pesas", "Cardio", "Lockers"],
      classesIncluded: true,
      color: "#00f2fe"
    },
    {
      id: "plan_2",
      name: "Plan Mensual Estándar",
      price: 35.00,
      durationDays: 30,
      benefits: ["Acceso libre 6:00 a 22:00", "Área de musculación", "Cardio zone", "Lockers"],
      classesIncluded: false,
      color: "#10b981"
    },
    {
      id: "plan_3",
      name: "Plan Mensual PRO + Clases",
      price: 50.00,
      durationDays: 30,
      benefits: ["Acceso ilimitado", "Todas las clases grupales", "Evaluación física mensual", "Lockers VIP"],
      classesIncluded: true,
      color: "#8b5cf6"
    },
    {
      id: "plan_4",
      name: "Plan Trimestral Forza",
      price: 130.00,
      durationDays: 90,
      benefits: ["Acceso ilimitado", "Clases grupales", "1 Shake de cortesía semanal", "Plan nutricional básico"],
      classesIncluded: true,
      color: "#f59e0b"
    },
    {
      id: "plan_5",
      name: "Plan Anual Elite Black",
      price: 380.00,
      durationDays: 365,
      benefits: ["Acceso total 365 días", "Clases ilimitadas", "Toalla y locker fijo", "1 Sesión PT mensual", "Pase para 1 amigo al mes"],
      classesIncluded: true,
      color: "#ff3366"
    }
  ],
  members: [
    {
      id: "MEM-1001",
      dni: "1724589632",
      firstName: "Mateo",
      lastName: "Valenzuela",
      gender: "M",
      birthDate: "1994-05-14",
      phone: "+593 98 451 2367",
      email: "mateo.valenzuela@gmail.com",
      address: "La Floresta, Quito",
      emergencyContact: "Carolina Valenzuela (+593 99 123 4567)",
      medicalNotes: "Ninguna. Apto para alto rendimiento.",
      membershipId: "plan_3",
      startDate: "2026-09-01",
      endDate: "2026-10-01",
      status: "active", // active, expired, frozen, pending
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      trainerId: "STAFF-1",
      qrCode: "MEM-1001-1724589632",
      totalVisits: 18,
      lastVisit: new Date().toISOString().split('T')[0] + " 07:30"
    },
    {
      id: "MEM-1002",
      dni: "1719854231",
      firstName: "Valeria",
      lastName: "Morales",
      gender: "F",
      birthDate: "1998-11-20",
      phone: "+593 99 555 8899",
      email: "valeria.morales@outlook.com",
      address: "Cumbayá, San Juan",
      emergencyContact: "Roberto Morales (+593 98 777 6655)",
      medicalNotes: "Leve molestia en rodilla derecha (menisco curado).",
      membershipId: "plan_5",
      startDate: "2026-01-15",
      endDate: "2027-01-15",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      trainerId: "STAFF-2",
      qrCode: "MEM-1002-1719854231",
      totalVisits: 142,
      lastVisit: new Date().toISOString().split('T')[0] + " 08:15"
    },
    {
      id: "MEM-1003",
      dni: "0921478523",
      firstName: "Carlos",
      lastName: "Andrade",
      gender: "M",
      birthDate: "1988-03-09",
      phone: "+593 97 112 3344",
      email: "carlos.andrade@empresa.com",
      address: "González Suárez",
      emergencyContact: "Elena Díaz (+593 99 332 1100)",
      medicalNotes: "Hipertensión controlada con medicación.",
      membershipId: "plan_2",
      startDate: "2026-08-20",
      endDate: "2026-09-20",
      status: "expired", // vencido
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      trainerId: "STAFF-1",
      qrCode: "MEM-1003-0921478523",
      totalVisits: 24,
      lastVisit: "2026-09-19 19:20"
    },
    {
      id: "MEM-1004",
      dni: "1756412398",
      firstName: "Camila",
      lastName: "Paredes",
      gender: "F",
      birthDate: "2001-07-25",
      phone: "+593 98 900 1122",
      email: "cami.paredes@gmail.com",
      address: "Monteserrín",
      emergencyContact: "Patricia Paredes (+593 99 888 7766)",
      medicalNotes: "Asma leve inducida por ejercicio en frío.",
      membershipId: "plan_3",
      startDate: "2026-09-15",
      endDate: "2026-10-15",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      trainerId: "STAFF-3",
      qrCode: "MEM-1004-1756412398",
      totalVisits: 11,
      lastVisit: new Date().toISOString().split('T')[0] + " 10:00"
    },
    {
      id: "MEM-1005",
      dni: "1804561234",
      firstName: "Diego",
      lastName: "Santillán",
      gender: "M",
      birthDate: "1992-12-03",
      phone: "+593 96 333 4455",
      email: "diego.santillan@tech.io",
      address: "El Batán",
      emergencyContact: "Lucía Santillán (+593 99 444 5566)",
      medicalNotes: "Ninguna.",
      membershipId: "plan_4",
      startDate: "2026-07-10",
      endDate: "2026-10-10",
      status: "frozen", // congelado por viaje
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      trainerId: "STAFF-2",
      qrCode: "MEM-1005-1804561234",
      totalVisits: 45,
      lastVisit: "2026-09-05 18:40"
    }
  ],
  staff: [
    {
      id: "STAFF-1",
      name: "Alex 'Forza' Rivera",
      role: "Head Coach & Musculación",
      phone: "+593 98 123 4567",
      email: "alex.coach@forzagym.com",
      shift: "Mañana (06:00 - 14:00)",
      specialty: "Hipertrofia, Fuerza y Biomecánica",
      avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STAFF-2",
      name: "Sofía Arboleda",
      role: "Instructora CrossFit & HIIT",
      phone: "+593 99 765 4321",
      email: "sofia.fit@forzagym.com",
      shift: "Tarde (14:00 - 22:00)",
      specialty: "Acondicionamiento Físico & Resistencia",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "STAFF-3",
      name: "Esteban Mendoza",
      role: "Instructor Spinning & Funcional",
      phone: "+593 98 998 8776",
      email: "esteban.cycle@forzagym.com",
      shift: "Flexible",
      specialty: "Cycling Indoor y Nutrición Deportiva",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    }
  ],
  products: [
    {
      id: "PROD-1",
      name: "Proteína Whey Gold Standard 5lb",
      category: "Suplementos",
      costPrice: 65.00,
      salePrice: 89.99,
      stock: 14,
      minStock: 4,
      barcode: "786100112233",
      icon: "fa-solid fa-jar"
    },
    {
      id: "PROD-2",
      name: "Creatina Monohidratada Creapure 300g",
      category: "Suplementos",
      costPrice: 22.00,
      salePrice: 34.50,
      stock: 22,
      minStock: 5,
      barcode: "786100112234",
      icon: "fa-solid fa-flask-vial"
    },
    {
      id: "PROD-3",
      name: "Pre-Entreno C4 Explosive Ripped",
      category: "Suplementos",
      costPrice: 28.00,
      salePrice: 42.00,
      stock: 8,
      minStock: 3,
      barcode: "786100112235",
      icon: "fa-solid fa-bolt"
    },
    {
      id: "PROD-4",
      name: "Bebida Isotónica Gatorade 750ml",
      category: "Bebidas",
      costPrice: 1.10,
      salePrice: 2.00,
      stock: 45,
      minStock: 12,
      barcode: "786100112236",
      icon: "fa-solid fa-bottle-water"
    },
    {
      id: "PROD-5",
      name: "Agua Mineral Sin Gas 600ml",
      category: "Bebidas",
      costPrice: 0.40,
      salePrice: 1.00,
      stock: 60,
      minStock: 15,
      barcode: "786100112237",
      icon: "fa-solid fa-droplet"
    },
    {
      id: "PROD-6",
      name: "Barra de Proteína Quest Bar 60g",
      category: "Snacks",
      costPrice: 1.80,
      salePrice: 3.50,
      stock: 32,
      minStock: 8,
      barcode: "786100112238",
      icon: "fa-solid fa-cookie-bite"
    },
    {
      id: "PROD-7",
      name: "Shaker Mezclador BlenderBottle 28oz",
      category: "Accesorios",
      costPrice: 6.00,
      salePrice: 12.00,
      stock: 18,
      minStock: 4,
      barcode: "786100112239",
      icon: "fa-solid fa-glass-water"
    },
    {
      id: "PROD-8",
      name: "Toalla Deportiva Microfibra Gym",
      category: "Accesorios",
      costPrice: 4.50,
      salePrice: 9.00,
      stock: 25,
      minStock: 5,
      barcode: "786100112240",
      icon: "fa-solid fa-rug"
    },
    {
      id: "PROD-9",
      name: "Cinturón de Fuerza Cuero Forza",
      category: "Accesorios",
      costPrice: 18.00,
      salePrice: 32.00,
      stock: 6,
      minStock: 2,
      barcode: "786100112241",
      icon: "fa-solid fa-shield-halved"
    }
  ],
  classes: [
    {
      id: "CLS-1",
      name: "Spinning Extreme Power",
      trainerId: "STAFF-3",
      room: "Sala Ciclo Indoor",
      day: "Lunes",
      time: "07:00 - 08:00",
      capacity: 20,
      booked: 16,
      category: "spinning",
      color: "#f59e0b"
    },
    {
      id: "CLS-2",
      name: "CrossFit WOD Forza",
      trainerId: "STAFF-2",
      room: "Box CrossFit Principal",
      day: "Lunes",
      time: "18:00 - 19:15",
      capacity: 15,
      booked: 14,
      category: "crossfit",
      color: "#ef4444"
    },
    {
      id: "CLS-3",
      name: "Yoga Flow & Movilidad",
      trainerId: "STAFF-2",
      room: "Sala Zen & Pilates",
      day: "Martes",
      time: "08:00 - 09:00",
      capacity: 18,
      booked: 12,
      category: "yoga",
      color: "#10b981"
    },
    {
      id: "CLS-4",
      name: "Boxeo & Defensa Personal",
      trainerId: "STAFF-1",
      room: "Ring & Área de Combate",
      day: "Miércoles",
      time: "19:00 - 20:00",
      capacity: 16,
      booked: 15,
      category: "boxeo",
      color: "#8b5cf6"
    },
    {
      id: "CLS-5",
      name: "HIIT Metabólico Quema Grasa",
      trainerId: "STAFF-2",
      room: "Sala Polivalente",
      day: "Jueves",
      time: "18:30 - 19:30",
      capacity: 20,
      booked: 18,
      category: "crossfit",
      color: "#ef4444"
    },
    {
      id: "CLS-6",
      name: "Spinning Sunset Beats",
      trainerId: "STAFF-3",
      room: "Sala Ciclo Indoor",
      day: "Viernes",
      time: "17:30 - 18:30",
      capacity: 20,
      booked: 19,
      category: "spinning",
      color: "#f59e0b"
    }
  ],
  routines: [
    {
      id: "ROUT-1",
      memberId: "MEM-1001",
      name: "Hipertrofia Torso-Pierna 4 Días",
      trainer: "Alex 'Forza' Rivera",
      goal: "Ganancia de masa muscular limpia",
      days: [
        {
          dayName: "Día 1: Pecho & Espalda",
          exercises: [
            { name: "Press Banca Plano con Barra", sets: 4, reps: "8-10", rest: "90s", notes: "Controlar bajada en 2 seg" },
            { name: "Dominadas Lastradas o Polea al Pecho", sets: 4, reps: "10-12", rest: "90s", notes: "Apertura amplia" },
            { name: "Press Inclinado con Mancuernas", sets: 3, reps: "10-12", rest: "75s", notes: "Ángulo de 30°" },
            { name: "Remo con Barra T", sets: 4, reps: "10", rest: "90s", notes: "Espalda recta" }
          ]
        },
        {
          dayName: "Día 2: Pierna Completa",
          exercises: [
            { name: "Sentadilla Libre Trasera", sets: 4, reps: "6-8", rest: "120s", notes: "Profundidad completa" },
            { name: "Prensa Inclinada 45°", sets: 4, reps: "12-15", rest: "90s", notes: "Pies a la anchura de hombros" },
            { name: "Peso Muerto Rumano", sets: 4, reps: "10", rest: "90s", notes: "Enfoque en femorales" },
            { name: "Elevación de Gemelos en Máquina", sets: 4, reps: "15-20", rest: "60s", notes: "Pausa de 1s arriba" }
          ]
        }
      ]
    },
    {
      id: "ROUT-2",
      memberId: "MEM-1002",
      name: "Tonificación & Glúteos Hipertrofia",
      trainer: "Sofía Arboleda",
      goal: "Definición y fuerza en tren inferior",
      days: [
        {
          dayName: "Día 1: Glúteos & Isquios",
          exercises: [
            { name: "Hip Thrust con Barra Pesada", sets: 4, reps: "10-12", rest: "90s", notes: "Squeeze 2 seg arriba" },
            { name: "Sentadilla Búlgara con Mancuernas", sets: 3, reps: "12 por pierna", rest: "75s", notes: "Torso inclinado adelante" },
            { name: "Abductores en Polea o Máquina", sets: 4, reps: "15-20", rest: "60s", notes: "Quema al fallo" }
          ]
        }
      ]
    }
  ],
  measurements: [
    {
      id: "MEAS-1",
      memberId: "MEM-1001",
      date: "2026-09-01",
      weightKg: 78.5,
      heightCm: 178,
      bodyFatPct: 15.2,
      muscleMassKg: 38.4,
      chestCm: 104,
      armsCm: 38.5,
      waistCm: 82,
      hipsCm: 96,
      thighCm: 59
    },
    {
      id: "MEAS-2",
      memberId: "MEM-1001",
      date: "2026-09-25",
      weightKg: 80.1,
      heightCm: 178,
      bodyFatPct: 14.3,
      muscleMassKg: 39.8,
      chestCm: 106,
      armsCm: 39.2,
      waistCm: 81,
      hipsCm: 97,
      thighCm: 60
    },
    {
      id: "MEAS-3",
      memberId: "MEM-1002",
      date: "2026-08-15",
      weightKg: 58.2,
      heightCm: 165,
      bodyFatPct: 21.0,
      muscleMassKg: 24.5,
      chestCm: 88,
      armsCm: 26.5,
      waistCm: 66,
      hipsCm: 98,
      thighCm: 54
    }
  ],
  attendances: [
    {
      id: "ATT-001",
      memberId: "MEM-1001",
      memberName: "Mateo Valenzuela",
      membershipName: "Plan Mensual PRO + Clases",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: "07:30",
      status: "granted",
      method: "QR Digital"
    },
    {
      id: "ATT-002",
      memberId: "MEM-1002",
      memberName: "Valeria Morales",
      membershipName: "Plan Anual Elite Black",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: "08:15",
      status: "granted",
      method: "DNI / Cédula"
    },
    {
      id: "ATT-003",
      memberId: "MEM-1004",
      memberName: "Camila Paredes",
      membershipName: "Plan Mensual PRO + Clases",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      status: "granted",
      method: "QR Digital"
    }
  ],
  sales: [
    {
      id: "SALE-2026-001",
      type: "membership",
      memberId: "MEM-1001",
      customerName: "Mateo Valenzuela",
      items: [{ name: "Plan Mensual PRO + Clases", qty: 1, price: 50.00, total: 50.00 }],
      subtotal: 43.48,
      tax: 6.52,
      total: 50.00,
      paymentMethod: "Transferencia",
      date: "2026-09-01 10:15",
      cashier: "Admin Principal"
    },
    {
      id: "SALE-2026-002",
      type: "pos",
      memberId: "MEM-1002",
      customerName: "Valeria Morales",
      items: [
        { name: "Creatina Monohidratada Creapure 300g", qty: 1, price: 34.50, total: 34.50 },
        { name: "Bebida Isotónica Gatorade 750ml", qty: 2, price: 2.00, total: 4.00 }
      ],
      subtotal: 33.48,
      tax: 5.02,
      total: 38.50,
      paymentMethod: "Tarjeta Débito",
      date: "2026-09-28 17:40",
      cashier: "Admin Principal"
    }
  ],
  expenses: [
    {
      id: "EXP-01",
      concept: "Mantenimiento preventivo de poleas y caminadoras",
      category: "Mantenimiento",
      amount: 85.00,
      date: "2026-09-15",
      responsible: "Alex Rivera",
      paymentMethod: "Efectivo"
    },
    {
      id: "EXP-02",
      concept: "Compra de suministros de limpieza y desinfección",
      category: "Insumos",
      amount: 45.00,
      date: "2026-09-20",
      responsible: "Recepción",
      paymentMethod: "Efectivo"
    }
  ],
  users: [
    {
      id: "usr_admin",
      name: "Administrador Principal",
      username: "admin",
      pin: "1234",
      email: "admin@forzagym.com",
      phone: "+593 99 876 5432",
      role: "admin",
      roleTitle: "Administrador General",
      status: "active",
      avatar: "AD",
      permissions: ["all"],
      createdAt: "2026-01-01"
    },
    {
      id: "usr_reception",
      name: "Carolina Vega",
      username: "recepcion",
      pin: "1234",
      email: "carolina@forzagym.com",
      phone: "+593 98 765 4321",
      role: "receptionist",
      roleTitle: "Recepcionista / Front Desk",
      status: "active",
      avatar: "CV",
      permissions: ["access", "members", "pos", "classes", "finances"],
      createdAt: "2026-02-15"
    },
    {
      id: "usr_coach",
      name: "Alex 'Forza' Rivera",
      username: "coach",
      pin: "1234",
      email: "alex.coach@forzagym.com",
      phone: "+593 98 123 4567",
      role: "trainer",
      roleTitle: "Head Coach & Musculación",
      status: "active",
      avatar: "AR",
      permissions: ["routines", "classes", "members"],
      createdAt: "2026-03-01"
    },
    {
      id: "usr_cashier",
      name: "Mateo Morales",
      username: "caja",
      pin: "1234",
      email: "mateo@forzagym.com",
      phone: "+593 97 112 2334",
      role: "cashier",
      roleTitle: "Cajero & Ventas POS",
      status: "active",
      avatar: "MM",
      permissions: ["pos", "finances"],
      createdAt: "2026-04-10"
    }
  ]
};

// Data Store Class
class GymDatabase {
  constructor() {
    this.data = this.load();
    this.currentUser = this.loadCurrentUser();
  }

  load() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          parsed.users = JSON.parse(JSON.stringify(INITIAL_DATA.users));
          this.save(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load stored database, reverting to seed data:", e);
    }
    this.save(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  loadCurrentUser() {
    try {
      const stored = localStorage.getItem('FORZAGYM_CURRENT_USER');
      if (stored) {
        const usr = JSON.parse(stored);
        // Verify user still exists in DB
        const found = (this.data.users || []).find(u => u.id === usr.id);
        if (found && found.status === 'active') {
          return found;
        }
      }
    } catch (e) {
      console.warn("Could not load active user:", e);
    }
    // Default to admin
    const defaultAdmin = (this.data.users || []).find(u => u.role === 'admin') || INITIAL_DATA.users[0];
    this.setCurrentUser(defaultAdmin);
    return defaultAdmin;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    try {
      localStorage.setItem('FORZAGYM_CURRENT_USER', JSON.stringify(user));
    } catch (e) {
      console.error("Error setting active user:", e);
    }
    return this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser || this.loadCurrentUser();
  }

  save(dataToSave = null, skipCloudPush = false) {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Error saving database to LocalStorage:", e);
    }

    // Automatically synchronize to Firebase Cloud Database in real-time
    if (!skipCloudPush && window.GymFirebaseSync && window.GymFirebaseSync.isConnected) {
      window.GymFirebaseSync.pushData(this.data);
    }
  }

  applyCloudData(cloudData, updatedAt) {
    if (!cloudData || typeof cloudData !== 'object') return;
    this.data = cloudData;
    this.save(null, true); // save locally without re-pushing to cloud

    // Sync active user session
    if (this.currentUser) {
      const found = (this.data.users || []).find(u => u.id === this.currentUser.id);
      if (found) {
        this.currentUser = found;
      }
    }

    // Notify UI to re-render in real-time
    if (window.GymAppInstance && typeof window.GymAppInstance.onCloudDataSync === 'function') {
      window.GymAppInstance.onCloudDataSync();
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
    return this.data;
  }

  // --- Members ---
  getMembers() {
    return this.data.members || [];
  }

  getMemberById(id) {
    return this.getMembers().find(m => m.id === id || m.dni === id || m.qrCode === id);
  }

  addMember(memberData) {
    const newId = `MEM-${1000 + this.data.members.length + 1}`;
    const newMember = {
      id: newId,
      totalVisits: 0,
      qrCode: `${newId}-${memberData.dni}`,
      ...memberData
    };
    this.data.members.unshift(newMember);
    this.save();
    return newMember;
  }

  updateMember(id, updatedFields) {
    const index = this.data.members.findIndex(m => m.id === id);
    if (index !== -1) {
      this.data.members[index] = { ...this.data.members[index], ...updatedFields };
      this.save();
      return this.data.members[index];
    }
    return null;
  }

  deleteMember(id) {
    this.data.members = this.data.members.filter(m => m.id !== id);
    this.save();
  }

  // --- Memberships ---
  getMemberships() {
    return this.data.memberships || [];
  }

  getMembershipById(id) {
    return this.getMemberships().find(p => p.id === id);
  }

  addMembership(plan) {
    const newId = `plan_${Date.now()}`;
    const newPlan = { id: newId, ...plan };
    this.data.memberships.push(newPlan);
    this.save();
    return newPlan;
  }

  updateMembership(id, updatedFields) {
    const index = this.data.memberships.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.memberships[index] = { ...this.data.memberships[index], ...updatedFields };
      this.save();
      return this.data.memberships[index];
    }
    return null;
  }

  deleteMembership(id) {
    this.data.memberships = this.data.memberships.filter(p => p.id !== id);
    this.save();
  }

  // --- Products & POS ---
  getProducts() {
    return this.data.products || [];
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id || p.barcode === id);
  }

  addProduct(prod) {
    const newId = `PROD-${Date.now().toString().slice(-4)}`;
    const newProd = { id: newId, ...prod };
    this.data.products.push(newProd);
    this.save();
    return newProd;
  }

  updateProductStock(productId, qtySold) {
    const prod = this.getProductById(productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - qtySold);
      this.save();
    }
  }

  // --- Sales ---
  recordSale(saleData) {
    const saleId = `SALE-${new Date().getFullYear()}-${String(this.data.sales.length + 1).padStart(3, '0')}`;
    const fullSale = {
      id: saleId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cashier: "Admin Recepción",
      ...saleData
    };
    this.data.sales.unshift(fullSale);

    // Update POS product stocks if it's POS sale
    if (saleData.items && saleData.type === 'pos') {
      saleData.items.forEach(item => {
        if (item.productId) {
          this.updateProductStock(item.productId, item.qty);
        }
      });
    }

    // Update cash register if paid in cash
    if (saleData.paymentMethod === 'Efectivo' && this.data.cashRegister.isOpen) {
      this.data.cashRegister.currentCash += fullSale.total;
    }

    this.save();
    return fullSale;
  }

  // --- Attendance ---
  recordAttendance(member, method = "QR Escaneado") {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().split('T')[0];

    const attendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-5)}`,
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      membershipName: this.getMembershipById(member.membershipId)?.name || 'Membresía',
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      status: member.status === 'active' ? 'granted' : 'denied',
      method: method
    };

    this.data.attendances.unshift(attendanceRecord);

    if (member.status === 'active') {
      // update member stats
      member.totalVisits = (member.totalVisits || 0) + 1;
      member.lastVisit = `${dateStr} ${timeStr}`;
      this.updateMember(member.id, {
        totalVisits: member.totalVisits,
        lastVisit: member.lastVisit
      });
    }

    this.save();
    return attendanceRecord;
  }

  getTodayAttendances() {
    const today = new Date().toISOString().split('T')[0];
    return (this.data.attendances || []).filter(a => a.date === today);
  }

  // --- Staff & Classes ---
  getStaff() {
    return this.data.staff || [];
  }

  getClasses() {
    return this.data.classes || [];
  }

  bookClassSpot(classId) {
    const cls = this.data.classes.find(c => c.id === classId);
    if (cls && cls.booked < cls.capacity) {
      cls.booked += 1;
      this.save();
      return true;
    }
    return false;
  }

  // --- Routines & Measurements ---
  getRoutinesByMember(memberId) {
    return (this.data.routines || []).filter(r => r.memberId === memberId);
  }

  addRoutine(routine) {
    const newId = `ROUT-${Date.now()}`;
    const newRoutine = { id: newId, ...routine };
    this.data.routines.push(newRoutine);
    this.save();
    return newRoutine;
  }

  getMeasurementsByMember(memberId) {
    return (this.data.measurements || []).filter(m => m.memberId === memberId);
  }

  addMeasurement(meas) {
    const newId = `MEAS-${Date.now()}`;
    const newMeas = { id: newId, ...meas };
    this.data.measurements.push(newMeas);
    this.save();
    return newMeas;
  }

  // --- Expenses & Finances ---
  getExpenses() {
    return this.data.expenses || [];
  }

  addExpense(expense) {
    const newId = `EXP-${Date.now().toString().slice(-4)}`;
    const newExp = { id: newId, ...expense };
    this.data.expenses.unshift(newExp);
    if (expense.paymentMethod === 'Efectivo' && this.data.cashRegister.isOpen) {
      this.data.cashRegister.currentCash -= newExp.amount;
    }
    this.save();
    return newExp;
  }

  // --- Users & Staff Management (RBAC) ---
  getUsers() {
    return this.data.users || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByUsername(username) {
    if (!username) return null;
    return this.getUsers().find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  addUser(userData) {
    const newId = `usr_${Date.now().toString(36)}`;
    const initials = (userData.name || 'US')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: newId,
      name: userData.name || "Nuevo Empleado",
      username: (userData.username || `emp_${Date.now()}`).trim().toLowerCase(),
      pin: userData.pin || "1234",
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "receptionist",
      roleTitle: userData.roleTitle || "Empleado",
      status: userData.status || "active",
      avatar: initials,
      permissions: Array.isArray(userData.permissions) && userData.permissions.length > 0 
        ? userData.permissions 
        : ["access", "members"],
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!this.data.users) this.data.users = [];
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updatedFields) {
    if (!this.data.users) this.data.users = [];
    const index = this.data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      if (updatedFields.name) {
        updatedFields.avatar = updatedFields.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
      }
      this.data.users[index] = { ...this.data.users[index], ...updatedFields };
      this.save();

      // If updating current active user, sync session
      if (this.currentUser && this.currentUser.id === id) {
        this.setCurrentUser(this.data.users[index]);
      }

      return this.data.users[index];
    }
    return null;
  }

  deleteUser(id) {
    if (!this.data.users) return false;
    // Protect the primary admin user from deletion
    const user = this.getUserById(id);
    if (user && user.role === 'admin' && this.getUsers().filter(u => u.role === 'admin').length <= 1) {
      return { success: false, message: "No se puede eliminar el único administrador del sistema." };
    }

    this.data.users = this.data.users.filter(u => u.id !== id);
    this.save();

    // If current logged-in user was deleted, reset to admin
    if (this.currentUser && this.currentUser.id === id) {
      const defaultAdmin = this.getUsers().find(u => u.role === 'admin') || INITIAL_DATA.users[0];
      this.setCurrentUser(defaultAdmin);
    }

    return { success: true };
  }

  authenticateUser(username, pin) {
    const user = this.getUserByUsername(username);
    if (!user) {
      return { success: false, message: "Usuario no encontrado." };
    }
    if (user.status !== 'active') {
      return { success: false, message: "Este usuario se encuentra inactivo. Consulta con el administrador." };
    }
    if (user.pin !== pin.trim()) {
      return { success: false, message: "PIN o contraseña incorrectos." };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  }

  // --- Backup & Restore ---
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.members && parsed.memberships) {
        this.save(parsed);
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON import:", e);
    }
    return false;
  }
}

// Global DB instance
window.GymDB = new GymDatabase();
