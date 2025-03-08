import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPositionCandidates = async (positionId: number) => {
    try {
        const applications = await prisma.application.findMany({
            where: {
                positionId: positionId,
            },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                interviews: {
                    select: {
                        score: true,
                    },
                },
                interviewStep: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return applications.map(app => {
            // Calculate average score from interviews
            const scores = app.interviews
                .map(interview => interview.score)
                .filter((score): score is number => score !== null);
            
            const averageScore = scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : null;

            return {
                candidateId: app.candidateId,
                fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
                currentStage: app.interviewStep.name,
                averageScore: averageScore,
            };
        });
    } catch (error) {
        console.error('Error fetching position candidates:', error);
        throw new Error('Failed to fetch position candidates');
    }
}; 