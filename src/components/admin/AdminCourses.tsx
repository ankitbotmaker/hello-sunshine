import { useState } from 'react';
import { courses } from '@/data/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'secondary';
      case 'Intermediate': return 'default';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Management</CardTitle>
          <Badge variant="outline">{courses.length} courses</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium line-clamp-1">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {course.categories.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getLevelColor(course.level)}>{course.level}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">${course.currentPrice}</p>
                    {course.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${course.originalPrice}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/course/${course.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-sm text-muted-foreground mt-4">
          Note: Course data is currently stored statically. Database integration for full CRUD operations can be added.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminCourses;
