import EmptyList from '@/components/global/EmptyList';
import { fetchAdminProducts } from '@/utils/actions';
import Link from 'next/link';
import FormContainer from '@/components/form/FormContainer';
import { formatCurrency } from '@/utils/format';
import { deleteProduct } from '@/utils/actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconButton } from '@/components/form/Buttons';
import { actionFunction } from '@/utils/types';

async function ItemsPage() {
  const items = await fetchAdminProducts();

  if (items.length === 0) return <EmptyList />;

  return (
    <section>
      <Table>
        <TableCaption className="capitalize">
          total products : {items.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const { id: productId, name, company, price } = item;
            const removeProduct = deleteProduct.bind(null, {
              productId,
            }) as actionFunction;

            return (
              <TableRow key={productId}>
                <TableCell>
                  <Link
                    href={`/products/${productId}`}
                    className="underline text-muted-foreground tracking-wide capitalize"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{company}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>

                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/admin/products/${productId}/edit`}>
                    <IconButton actionType="edit" name={name} />
                  </Link>
                  <FormContainer action={removeProduct}>
                    <IconButton actionType="delete" name={name} />
                  </FormContainer>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

export default ItemsPage;
