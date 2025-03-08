import { PrismaClient } from '@prisma/client';
import { getPositionCandidates } from '../application/services/positionService';
import { updateCandidateStage } from '../application/services/applicationService';

const prisma = new PrismaClient();

describe('Position Service', () => {
    beforeEach(async () => {
        // Clean up the test database
        await prisma.interview.deleteMany();
        await prisma.application.deleteMany();
        await prisma.candidate.deleteMany();
        await prisma.position.deleteMany();
    });

    test('getPositionCandidates returns correct data structure', async () => {
        // Create test data
        const position = await prisma.position.create({
            data: {
                companyId: 1,
                interviewFlowId: 1,
                title: 'Test Position',
                description: 'Test Description',
                location: 'Test Location',
                jobDescription: 'Test Job Description',
            },
        });

        const candidates = await getPositionCandidates(position.id);
        
        expect(Array.isArray(candidates)).toBe(true);
        if (candidates.length > 0) {
            expect(candidates[0]).toHaveProperty('fullName');
            expect(candidates[0]).toHaveProperty('currentStage');
            expect(candidates[0]).toHaveProperty('averageScore');
        }
    });
});

describe('Application Service', () => {
    test('updateCandidateStage throws error for non-existent candidate', async () => {
        await expect(updateCandidateStage(999, 1)).rejects.toThrow('Candidate not found');
    });

    test('updateCandidateStage throws error for invalid stage', async () => {
        // Create a test candidate first
        const candidate = await prisma.candidate.create({
            data: {
                firstName: 'Test',
                lastName: 'Candidate',
                email: 'test@example.com',
            },
        });

        await expect(updateCandidateStage(candidate.id, 999)).rejects.toThrow('Invalid stage');
    });
}); 