import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

interface IProduct {
  id: string
  title: string
}

interface CategoryProps {
  products: IProduct[]
}

export default function Category({ products }: CategoryProps) {
  const router = useRouter()
  if(router.isFallback){
    return <p>Carregando...</p>
  }
  return (
    <div>
      <h1>{router.query.slug}</h1>
        <ul>
          {products.map(recommendedProduct => (
            <li key={recommendedProduct.id}>
              {recommendedProduct.title}
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('http://localhost:3333/categories')
  const categories = await response.json()

  return {
    paths: categories.map((category: IProduct) => ({
      params: { slug: category.id }
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async(context) => {

  const {slug}= context.params

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`)
  const products = await response.json()

  return {
    props: { products },
    revalidate: 60,
  }
}
