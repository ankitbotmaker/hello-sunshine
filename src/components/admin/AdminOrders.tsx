import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, DollarSign, ShoppingCart } from 'lucide-react';

interface Purchase {
  id: string;
  user_id: string;
  course_title: string;
  price: number;
  original_price: number | null;
  status: string;
  purchased_at: string;
  download_url: string | null;
}

const AdminOrders = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('purchased_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching orders', description: error.message, variant: 'destructive' });
    } else {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleStatusChange = async (purchaseId: string, newStatus: string) => {
    const { error } = await supabase
      .from('purchases')
      .update({ status: newStatus })
      .eq('id', purchaseId);

    if (error) {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Order status updated' });
      fetchPurchases();
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.price), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-emerald-500/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-emerald-400 rounded-xl shadow-lg shadow-primary/25">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/50">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/25">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/50">Total Orders</p>
              <p className="text-2xl font-bold text-white">{purchases.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl shadow-lg shadow-purple-500/25">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/50">Avg Order Value</p>
              <p className="text-2xl font-bold text-white">
                ${purchases.length > 0 ? (totalRevenue / purchases.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Order Management</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-white/40" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Status</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-white/10">Pending</SelectItem>
                <SelectItem value="refunded" className="text-white hover:bg-white/10">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                <ShoppingCart className="h-12 w-12 text-white/30" />
              </div>
              <p className="text-white/50">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPurchases.map((purchase) => (
                <div key={purchase.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-white">{purchase.course_title}</p>
                    <p className="text-sm text-white/50 font-mono">#{purchase.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-primary">${Number(purchase.price).toFixed(2)}</p>
                    <Badge className={
                      purchase.status === 'completed' ? 'bg-primary/20 text-primary border-0' :
                      purchase.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-0' :
                      'bg-red-500/20 text-red-400 border-0'
                    }>
                      {purchase.status}
                    </Badge>
                    <span className="text-sm text-white/50">
                      {new Date(purchase.purchased_at).toLocaleDateString()}
                    </span>
                    <Select
                      value={purchase.status}
                      onValueChange={(value) => handleStatusChange(purchase.id, value)}
                    >
                      <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                        <SelectItem value="pending" className="text-white hover:bg-white/10">Pending</SelectItem>
                        <SelectItem value="refunded" className="text-white hover:bg-white/10">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
