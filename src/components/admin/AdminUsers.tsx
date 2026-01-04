import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, Trash2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role')
    ]);

    if (profilesRes.error) {
      toast({ title: 'Error fetching users', description: profilesRes.error.message, variant: 'destructive' });
    } else {
      setProfiles(profilesRes.data || []);
    }

    if (rolesRes.error) {
      console.error('Error fetching roles:', rolesRes.error);
    } else {
      setUserRoles(rolesRes.data as UserRole[] || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserRole = (userId: string): string => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  const handleAddRole = async () => {
    if (!selectedUserId) return;

    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: selectedUserId, role: selectedRole }, { onConflict: 'user_id,role' });

    if (error) {
      toast({ title: 'Error adding role', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Role updated successfully' });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleRemoveRole = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Error removing role', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Role removed successfully' });
      fetchData();
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <p className="text-sm text-white/50">{profiles.length} registered users</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Assign Role to User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {profiles.map(profile => (
                      <SelectItem key={profile.user_id} value={profile.user_id} className="text-white hover:bg-white/10">
                        {profile.full_name || profile.user_id.slice(0, 8)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as 'admin' | 'moderator' | 'user')}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
                    <SelectItem value="moderator" className="text-white hover:bg-white/10">Moderator</SelectItem>
                    <SelectItem value="user" className="text-white hover:bg-white/10">User</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddRole} className="w-full bg-gradient-to-r from-violet-500 to-purple-500">
                  Assign Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-4 w-4 text-white/40" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
              <Users className="h-12 w-12 text-white/30" />
            </div>
            <p className="text-white/50">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(profile.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white">{profile.full_name || 'No name'}</p>
                    <p className="text-sm text-white/50">{profile.phone || 'No phone'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={
                    getUserRole(profile.user_id) === 'admin' ? 'bg-primary/20 text-primary border-0' :
                    getUserRole(profile.user_id) === 'moderator' ? 'bg-blue-500/20 text-blue-400 border-0' :
                    'bg-white/10 text-white/50 border-0'
                  }>
                    {getUserRole(profile.user_id)}
                  </Badge>
                  <span className="text-sm text-white/50">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                  {getUserRole(profile.user_id) !== 'user' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRole(profile.user_id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
