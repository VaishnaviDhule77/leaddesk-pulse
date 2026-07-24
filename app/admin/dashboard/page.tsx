import { connectDB } from '../../../lib/db';
import Lead from '../../../lib/models/Lead';
import DashboardClient from '../../../components/DashboardClient';

export default async function DashboardPage({ searchParams }: { searchParams: { search?: string } }) {
  await connectDB();
  const search = searchParams.search || '';
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();
  const statsArr = await Lead.aggregate([{ $group: { _id: null, total: { $sum: 1 }, new_count: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } }, contacted_count: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } }, closed_count: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } } } }]);
  const stats = statsArr[0] || { total: 0, new_count: 0, contacted_count: 0, closed_count: 0 };
  return <DashboardClient leads={JSON.parse(JSON.stringify(leads))} stats={stats} currentSearch={search} />;
}