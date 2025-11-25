import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Ticket {
  id?: string;
  name: string;
  phone: string;
  quantity: number;
  createdAt: Timestamp | Date | string;
  used: boolean;
  ticketCode?: string;
}

const TICKETS_COLLECTION = "tickets";

/**
 * Cria uma nova filipeta no Firestore
 */
export const createTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt" | "used">
): Promise<string> => {
  try {
    // Gerar código único para a filipeta
    const ticketCode = `FLP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const ticket: Omit<Ticket, "id"> = {
      ...ticketData,
      ticketCode,
      createdAt: Timestamp.now(),
      used: false,
    };

    const docRef = await addDoc(collection(db, TICKETS_COLLECTION), ticket);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar filipeta:", error);
    throw new Error("Não foi possível criar a filipeta");
  }
};

/**
 * Busca uma filipeta pelo ID
 */
export const getTicketById = async (
  ticketId: string
): Promise<Ticket | null> => {
  try {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Ticket;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar filipeta:", error);
    throw new Error("Não foi possível buscar a filipeta");
  }
};

/**
 * Busca uma filipeta pelo código
 */
export const getTicketByCode = async (
  ticketCode: string
): Promise<Ticket | null> => {
  try {
    const q = query(
      collection(db, TICKETS_COLLECTION),
      where("ticketCode", "==", ticketCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Ticket;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar filipeta por código:", error);
    throw new Error("Não foi possível buscar a filipeta");
  }
};

/**
 * Marca uma filipeta como usada
 */
export const markTicketAsUsed = async (ticketId: string): Promise<void> => {
  try {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId);
    await updateDoc(docRef, {
      used: true,
    });
  } catch (error) {
    console.error("Erro ao marcar filipeta como usada:", error);
    throw new Error("Não foi possível atualizar a filipeta");
  }
};

/**
 * Busca todas as filipetas de um telefone
 */
export const getTicketsByPhone = async (phone: string): Promise<Ticket[]> => {
  try {
    const q = query(
      collection(db, TICKETS_COLLECTION),
      where("phone", "==", phone)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ticket[];
  } catch (error) {
    console.error("Erro ao buscar filipetas por telefone:", error);
    throw new Error("Não foi possível buscar as filipetas");
  }
};
