import express from 'express';
import { getPositionCandidates } from '../application/services/positionService';
import { updateCandidateStage } from '../application/services/applicationService';

const router = express.Router();

// GET /positions/:id/candidates
router.get('/:id/candidates', async (req, res) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID' });
        }

        const candidates = await getPositionCandidates(positionId);
        res.json(candidates);
    } catch (error) {
        console.error('Error in GET /positions/:id/candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /candidates/:id/stage
router.put('/:id/stage', async (req, res) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { stageId } = req.body;

        if (isNaN(candidateId) || !stageId) {
            return res.status(400).json({ 
                error: 'Invalid request. Both candidateId and stageId are required' 
            });
        }

        await updateCandidateStage(candidateId, stageId);
        res.json({ message: 'Stage updated successfully' });
    } catch (error: any) {
        console.error('Error in PUT /candidates/:id/stage:', error);
        
        if (error.message === 'Candidate not found') {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        if (error.message === 'Invalid stage') {
            return res.status(400).json({ error: 'Invalid stage ID' });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 