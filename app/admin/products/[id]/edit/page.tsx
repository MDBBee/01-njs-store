import {
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
} from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/Forminput';
import PriceInput from '@/components/form/Priceinput';
import TextAreaInput from '@/components/form/TextAreainput';
import { SubmitButton } from '@/components/form/Buttons';
import CheckboxInput from '@/components/form/Checkboxinput';
import type { actionFunction, product } from '@/utils/types';
import ImageInputContainer from '@/components/form/ImageinputContainer';

// params: { id: '74bf9b50-4fd2-42ad-ae3e-ba960a99d944' },
// searchParams: {}
async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await fetchAdminProductDetails(id);

  const { name, company, description, featured, price, image } =
    product as product;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">update product</h1>
      <div className="border p-8 rounded-md">
        {/* Image Input Container */}

        <ImageInputContainer
          name={name}
          image={image}
          text="update image"
          action={updateProductImageAction}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={image} />
        </ImageInputContainer>

        <FormContainer action={updateProductAction as actionFunction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <input type="hidden" name="id" value={id} />
            <FormInput
              type="text"
              name="name"
              label="product name"
              defaultValue={name}
            />
            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={company}
            />

            <PriceInput defaultValue={price} />
          </div>
          <TextAreaInput
            name="description"
            labelText="product description"
            defaultValue={description}
          />
          <div className="mt-6">
            <CheckboxInput
              name="featured"
              label="featured"
              defaultChecked={featured}
            />
          </div>
          <SubmitButton text="update product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditProductPage;
