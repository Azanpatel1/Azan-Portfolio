import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Hand from '../handwriting/Hand';

/** catch-all: on blank paper an unknown URL must not look like the handwriting failing to appear */
const NotFoundPage = () => (
  <Layout>
    <section className="pt-40 pb-28">
      <div className="container text-center">
        <Hand as="p" className="label mb-4">404</Hand>
        <Hand as="h1" roughSm className="text-3xl font-medium text-text mb-6">Page not found</Hand>
        <Link to="/" className="btn btn-ghost"><Hand>Back home</Hand></Link>
      </div>
    </section>
  </Layout>
);

export default NotFoundPage;
