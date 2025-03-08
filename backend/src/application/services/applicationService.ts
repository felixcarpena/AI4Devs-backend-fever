import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateCandidateStage = async (candidateId: number, newStageId: number) => {
    try {
        // First check if the candidate exists
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: {
                applications: true,
            },
        });

        if (!candidate) {
            throw new Error('Candidate not found');
        }

        // Check if the new stage exists
        const stage = await prisma.interviewStep.findUnique({
            where: { id: newStageId },
        });

        if (!stage) {
            throw new Error('Invalid stage');
        }

        // Update the stage for all active applications of the candidate
        const updatedApplications = await prisma.application.updateMany({
            where: {
                candidateId: candidateId,
            },
            data: {
                currentInterviewStep: newStageId,
            },
        });

        return updatedApplications;
    } catch (error) {
        console.error('Error updating candidate stage:', error);
        throw error;
    }
}; 