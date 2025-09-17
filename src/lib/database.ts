import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Database collections
export const COLLECTIONS = {
  MODELS: 'models',
  USERS: 'users',
  CHAT_SESSIONS: 'chat_sessions',
  CREDITS: 'credits',
  ORGANIZATIONS: 'organizations',
  PROVIDERS: 'providers'
} as const;

// Model data functions
export const modelService = {
  // Get all models
  async getAllModels() {
    const modelsRef = collection(db, COLLECTIONS.MODELS);
    const snapshot = await getDocs(modelsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get model by ID
  async getModelById(id: string) {
    const modelRef = doc(db, COLLECTIONS.MODELS, id);
    const snapshot = await getDoc(modelRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  // Add new model
  async addModel(modelData: any) {
    const modelsRef = collection(db, COLLECTIONS.MODELS);
    return await addDoc(modelsRef, {
      ...modelData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  },

  // Update model
  async updateModel(id: string, updateData: any) {
    const modelRef = doc(db, COLLECTIONS.MODELS, id);
    return await updateDoc(modelRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  }
};

// User data functions
export const userService = {
  // Get user profile
  async getUserProfile(uid: string) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  // Create/Update user profile
  async updateUserProfile(uid: string, profileData: any) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    return await updateDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now()
    });
  },

  // Create user profile (first time)
  async createUserProfile(uid: string, profileData: any) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    return await updateDoc(userRef, {
      ...profileData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
};

// Chat session functions
export const chatService = {
  // Get user's chat sessions
  async getUserChatSessions(uid: string) {
    const sessionsRef = collection(db, COLLECTIONS.CHAT_SESSIONS);
    const q = query(
      sessionsRef, 
      where('userId', '==', uid), 
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Create new chat session
  async createChatSession(uid: string, sessionData: any) {
    const sessionsRef = collection(db, COLLECTIONS.CHAT_SESSIONS);
    return await addDoc(sessionsRef, {
      ...sessionData,
      userId: uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  },

  // Update chat session
  async updateChatSession(sessionId: string, updateData: any) {
    const sessionRef = doc(db, COLLECTIONS.CHAT_SESSIONS, sessionId);
    return await updateDoc(sessionRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  }
};

// Credits system functions
export const creditsService = {
  // Get user credits
  async getUserCredits(uid: string) {
    const creditsRef = doc(db, COLLECTIONS.CREDITS, uid);
    const snapshot = await getDoc(creditsRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  // Update user credits
  async updateUserCredits(uid: string, creditsData: any) {
    const creditsRef = doc(db, COLLECTIONS.CREDITS, uid);
    return await updateDoc(creditsRef, {
      ...creditsData,
      updatedAt: Timestamp.now()
    });
  },

  // Create initial credits for new user
  async createUserCredits(uid: string, initialCredits: number = 100) {
    const creditsRef = doc(db, COLLECTIONS.CREDITS, uid);
    return await updateDoc(creditsRef, {
      balance: initialCredits,
      totalUsed: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
};

