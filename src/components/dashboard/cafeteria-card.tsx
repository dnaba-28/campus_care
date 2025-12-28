import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function CafeteriaCard() {
  const menuItems = ['Pizza', 'Salad Bar', 'Pasta Station', 'Grill Special'];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-sm font-medium">Cafeteria</CardTitle>
                <CardDescription>What's on the menu today</CardDescription>
            </div>
            <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline text-amber-600">Today's Menu</div>
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item} className="text-sm font-medium text-muted-foreground">
              - {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
