import type { 
  users,
  campuses,
  students,
  terms,
  categories,
  questions,
  kiosks,
  answers
} from './schema';

// User types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Campus types
export type Campus = typeof campuses.$inferSelect;
export type NewCampus = typeof campuses.$inferInsert;

// Student types
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

// Term types
export type Term = typeof terms.$inferSelect;
export type NewTerm = typeof terms.$inferInsert;

// Category types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// Question types
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

// Kiosk types
export type Kiosk = typeof kiosks.$inferSelect;
export type NewKiosk = typeof kiosks.$inferInsert;

// Answer types
export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert; 