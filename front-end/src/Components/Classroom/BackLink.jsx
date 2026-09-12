import React from 'react';
import { Link } from 'react-router-dom';

const BackLink = ({ to, label }) => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline"
    >
      <span aria-hidden="true">&larr;</span> {label}
    </Link>
  </div>
);

export default BackLink;
