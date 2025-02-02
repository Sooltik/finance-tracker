import React from 'react';

interface FinancialSummaryProps {
    assets: number;
    liabilities: number;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ assets, liabilities }) => (
    <div className="financial-summary">
        <div className="summary-item">
            <h2>Assets</h2>
            <p className="amount positive">${assets.toLocaleString()}</p>
        </div>
        <div className="summary-item">
            <h2>Liabilities</h2>
            <p className="amount negative">${liabilities.toLocaleString()}</p>
        </div>
    </div>
);

export default FinancialSummary;
