import express from 'express';
import path from 'path';
import appCore from '../app';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

app.get('/api/dashboard', (req, res) => {
    res.json(appCore.getDashboard());
});

app.post('/api/switch-mode', (req, res) => {
    const { mode } = req.body;
    if (['SOLO', 'FAMILY', 'ORGANIZER'].includes(mode)) {
        appCore.switchMode(mode);
        res.json({ success: true, mode });
    } else {
        res.status(400).json({ error: 'Invalid mode' });
    }
});

app.post('/api/pay', (req, res) => {
    // Mock logic for payment
    const state = appCore.getState();
    const { passengerId, billType } = req.body;

    if (state.group) {
        state.group = state.group.map((p: any) => {
            if (p.name === passengerId || p.id === passengerId) {
                if (p.billing[billType]) {
                    p.billing[billType].isPaid = true;
                    p.financialSummary.paidSoFar += p.billing[billType].amount || 0;
                }
            }
            return p;
        });
        // We'd save state here in a real app
    }

    res.json({ success: true, message: 'Payment marked successfully' });
});

app.post('/api/force-majeure', (req, res) => {
    const state = appCore.getState();
    if (state.budget && state.budget.projectedProfit) {
        state.budget.projectedProfit -= 50; // Mock 50$
    }
    res.json({ success: true, message: 'Force majeure applied' });
});

app.post('/api/nudge', (req, res) => {
    res.json({ success: true, message: 'Nudge sent successfully to ' + req.body.passengerId });
});

app.use( (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Server] TravelTech server running on port ${PORT}`);
});
