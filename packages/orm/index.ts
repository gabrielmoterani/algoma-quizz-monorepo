import 'dotenv/config';
import { eq } from 'drizzle-orm';
import {
  kiosks,
} from './schema';
import { db } from './db';

export const getKioskData = async (kioskId: string) => {
  const kiosk = await db.select().from(kiosks).where(eq(kiosks.id, kioskId));
  return kiosk[0];
};

