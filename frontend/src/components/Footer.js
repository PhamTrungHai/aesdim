import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [Year, setYear] = useState();
  useEffect(() => {
    const getYear = () => setYear(new Date().getFullYear());
    getYear();
  }, []);
  const titles = [
    { title: 'About Us' },
    { title: 'Get Help' },
    { title: 'Company' },
  ];
  const links = [
    [
      { link: 'News' },
      { link: 'Careers' },
      { link: 'Investors' },
      { link: 'Prupose' },
      { link: 'Sustainability' },
    ],
    [
      { link: 'Order Status' },
      { link: 'Shipping & Delivery' },
      { link: 'Payment Options' },
      { link: 'Gift Card Balance' },
      { link: 'Contact Us' },
      { link: 'FAQ' },
      { link: 'Blog' },
    ],
    [
      { link: 'Gift Cards' },
      { link: 'Promotions' },
      { link: 'Find A Store' },
      { link: 'Signup' },
      { link: 'Send Us Feeback' },
    ],
  ];
  return (
    <div className="store-container text-slate-200 ">
      <div className="grid items-start grid-cols-3 max-w-2xl w-full m-auto md:max-w-none md:gap-5">
        {titles.map((val, i) => (
          <div key={i} className="grid items-center">
            <h1 className="text-lg lg:text-base md:text-sm uppercase font-semibold">
              {val.title}
            </h1>
          </div>
        ))}
        {links.map((list, i) => (
          <ul key={i} className="grid items-center gap-1">
            {list.map((link, i) => (
              <li key={i} className="text-sm">
                {link.link}{' '}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="mt-5 text-center">
        <p className="text-sm md:text-center">
          Copyright<sup className="text-base font-bold">&copy;</sup> All
          Reserved Rights{' '}
          <span className="font-semibold">MADE BY AESDIM {Year}</span>
        </p>
      </div>
    </div>
  );
}
