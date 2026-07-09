-- DropIndex
DROP INDEX "Appointment_scheduledAt_idx";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "message" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_scheduledAt_key" ON "Appointment"("scheduledAt");
