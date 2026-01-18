import { getFinanceStats, getRecentTransactions } from '@/app/actions/finance';
import FinanceContent from './finance-content';

export default async function FinancePage() {
    // Fetch initial data on the server
    const stats = await getFinanceStats();
    const transactions = await getRecentTransactions();

    return <FinanceContent initialStats={stats} initialTransactions={transactions} />;
}


