import { integer, pgTable, varchar, uuid, jsonb, boolean, date, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name"),
  email: varchar("email"),
  role: varchar("role"),
});

export const campuses = pgTable("campuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  address: varchar("address"),
  kioskLocations: varchar("kiosk_locations"),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardData: jsonb("card_data"),
  nickName: varchar("nick_name"),
  email: varchar("email"),
  campusId: uuid("campus_id").references(() => campuses.id),
  age: integer("age"),
  course: varchar("course"),
});

export const terms = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  title: varchar("title"),
  subtitle: varchar("subtitle"),
  options: text("options").array(),
  correctAnswer: varchar("correct_answer"),
  categoryId: uuid("category_id").references(() => categories.id),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const kiosks = pgTable("kiosks", {
  id: uuid("id").primaryKey().defaultRandom(),
  campusId: uuid("campus_id").references(() => campuses.id),
  categoriesEnabled: text("categories_enabled"),
});

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").references(() => questions.id),
  studentId: uuid("student_id").references(() => students.id),
  selectedAnswer: varchar("selected_anser"), // Keeping the original column name as in your schema
  isCorrectAnswer: boolean("is_correct_answer"),
  termId: uuid("term_id").references(() => terms.id),
  kioskId: uuid("kiosk_id").references(() => kiosks.id),
});

// Relations
export const studentsRelations = relations(students, ({ one }) => ({
  campus: one(campuses, {
    fields: [students.campusId],
    references: [campuses.id],
  }),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  student: one(students, {
    fields: [answers.studentId],
    references: [students.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  term: one(terms, {
    fields: [answers.termId],
    references: [terms.id],
  }),
  kiosk: one(kiosks, {
    fields: [answers.kioskId],
    references: [kiosks.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
}));

export const kiosksRelations = relations(kiosks, ({ one }) => ({
  campus: one(campuses, {
    fields: [kiosks.campusId],
    references: [campuses.id],
  }),
}));