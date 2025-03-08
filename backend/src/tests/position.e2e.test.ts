import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Integration tests for Position and Candidate endpoints
 * Testing both GET /positions/:id/candidates and PUT /candidates/:id/stage
 */
describe('Position and Candidate Integration Tests', () => {
    let testData: {
        position?: any;
        candidate?: any;
        step1?: any;
        step2?: any;
    } = {};

    beforeAll(async () => {
        // Setup test data
        const company = await prisma.company.create({
            data: { name: 'Test Company' }
        });

        const flow = await prisma.interviewFlow.create({
            data: { description: 'Standard Interview Process' }
        });

        testData.step1 = await prisma.interviewStep.create({
            data: {
                interviewFlowId: flow.id,
                interviewTypeId: 1, // Assuming this exists from seed data
                name: 'Initial Interview',
                orderIndex: 1
            }
        });

        testData.step2 = await prisma.interviewStep.create({
            data: {
                interviewFlowId: flow.id,
                interviewTypeId: 1,
                name: 'Technical Interview',
                orderIndex: 2
            }
        });

        // Create test position
        testData.position = await prisma.position.create({
            data: {
                companyId: company.id,
                interviewFlowId: flow.id,
                title: 'Software Developer',
                description: 'Test Position',
                location: 'Remote',
                jobDescription: 'Test Description'
            }
        });

        // Create test candidate with application and interview
        testData.candidate = await prisma.candidate.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.test@example.com',
                applications: {
                    create: {
                        positionId: testData.position.id,
                        applicationDate: new Date(),
                        currentInterviewStep: testData.step1.id,
                        interviews: {
                            create: {
                                interviewStepId: testData.step1.id,
                                employeeId: 1,
                                interviewDate: new Date(),
                                score: 4
                            }
                        }
                    }
                }
            }
        });
    });

    afterAll(async () => {
        // Cleanup test data
        await prisma.interview.deleteMany();
        await prisma.application.deleteMany();
        await prisma.candidate.deleteMany();
        await prisma.position.deleteMany();
        await prisma.interviewStep.deleteMany();
        await prisma.interviewFlow.deleteMany();
        await prisma.company.deleteMany();
    });

    describe('GET /positions/:id/candidates', () => {
        it('should return candidates list with required fields', async () => {
            const response = await request(app)
                .get(`/positions/${testData.position.id}/candidates`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            
            const candidate = response.body[0];
            expect(candidate).toMatchObject({
                fullName: 'John Doe',
                currentStage: 'Initial Interview',
                averageScore: 4
            });
        });

        it('should return empty array for position with no candidates', async () => {
            const emptyPosition = await prisma.position.create({
                data: {
                    companyId: testData.position.companyId,
                    interviewFlowId: testData.position.interviewFlowId,
                    title: 'Empty Position',
                    description: 'Test',
                    location: 'Remote',
                    jobDescription: 'Test'
                }
            });

            const response = await request(app)
                .get(`/positions/${emptyPosition.id}/candidates`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should handle invalid position ID', async () => {
            const response = await request(app)
                .get('/positions/999999/candidates');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('PUT /candidates/:id/stage', () => {
        it('should update candidate stage successfully', async () => {
            const response = await request(app)
                .put(`/candidates/${testData.candidate.id}/stage`)
                .send({ stageId: testData.step2.id });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Stage updated successfully'
            });

            // Verify the update in database
            const application = await prisma.application.findFirst({
                where: { candidateId: testData.candidate.id }
            });
            expect(application?.currentInterviewStep).toBe(testData.step2.id);
        });

        it('should return 404 for non-existent candidate', async () => {
            const response = await request(app)
                .put('/candidates/999999/stage')
                .send({ stageId: testData.step2.id });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'Candidate not found'
            });
        });

        it('should return 400 for invalid stage', async () => {
            const response = await request(app)
                .put(`/candidates/${testData.candidate.id}/stage`)
                .send({ stageId: 999999 });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Invalid stage ID'
            });
        });

        it('should return 400 when stageId is missing', async () => {
            const response = await request(app)
                .put(`/candidates/${testData.candidate.id}/stage`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Invalid request. Both candidateId and stageId are required'
            });
        });
    });
}); 