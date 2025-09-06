import { Helmet } from 'react-helmet';

export const MetaTags = ({ title, description, keywords, image, url }) => {
  const defaultTitle = 'MR.El-Fallah  - Interactive English Learning Platform for Children';
  const defaultDescription =
    'Transform your child\'s English learning journey with MR.El-Fallah \'s engaging platform. Interactive lessons, games, and activities designed to make learning fun and effective for children of all ages.';
  const defaultKeywords =
    'english learning for kids, children\'s english education, interactive english lessons, kids language learning, english games for children, online english courses, children\'s education platform, english tutoring for kids, fun english learning, educational games';
  const defaultImage = 'https://res.cloudinary.com/duovxefh6/image/upload/v1750670187/logo_mm135b.png';
  const defaultUrl = 'http://elmisterelfallah.com';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:site_name" content="MR.El-Fallah " />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />
    </Helmet>
  );
};

// Predefined meta tags for different pages
export const pageMetaTags = {
  home: {
    title: 'MR.El-Fallah  - Interactive English Learning Platform for Children | Home',
    description:
      'Transform your child\'s English learning journey with MR.El-Fallah \'s engaging platform. Interactive lessons, games, and activities designed to make learning fun and effective for children of all ages.',
    keywords:
      'english learning for kids, children\'s english education, interactive english lessons, kids language learning, english games for children, online english courses, children\'s education platform',
    url: 'http://elmisterelfallah.com'
  },
  about: {
    title: 'About MR.El-Fallah  - Transforming Children\'s English Education',
    description:
      'Discover how MR.El-Fallah  is revolutionizing children\'s English education through innovative technology and engaging learning methods. Learn about our mission to make English learning accessible and enjoyable for every child.',
    keywords:
      'about MR.El-Fallah , english learning platform, children education, innovative learning, english education mission, kids language platform, educational technology',
    url: 'http://elmisterelfallah.com/about'
  },
  courses: {
    title: 'Interactive English Courses for Children - MR.El-Fallah  Learning Platform',
    description:
      'Explore our comprehensive collection of English courses tailored for children. From beginner to advanced levels, our interactive lessons, games, and activities make learning English engaging and effective.',
    keywords:
      'english courses for kids, interactive lessons, children education, online english learning, kids language courses, educational games, english curriculum',
    url: 'http://elmisterelfallah.com/allcourses'
  },
  contact: {
    title: 'Contact MR.El-Fallah  - Support for Your Child\'s English Learning Journey',
    description:
      'Get in touch with our dedicated support team for assistance with your child\'s English learning journey. We\'re here to help with any questions about our platform, courses, or learning methods.',
    keywords:
      'contact MR.El-Fallah , english learning support, children education help, platform assistance, learning guidance, customer support, educational inquiries',
    url: 'http://elmisterelfallah.com/contact'
  },
  login: {
    title: 'Login to MR.El-Fallah  - Access Your Child\'s English Learning Dashboard',
    description:
      'Access your MR.El-Fallah  account to continue your child\'s English learning journey. Track progress, access courses, and manage learning activities through our interactive dashboard.',
    keywords:
      'MR.El-Fallah  login, learning dashboard, account access, progress tracking, course management, learning activities, educational platform access',
    url: 'http://elmisterelfallah.com/login'
  },
  register: {
    title: 'Join MR.El-Fallah  - Start Your Child\'s English Learning Adventure',
    description:
      'Create your MR.El-Fallah  account today and begin your child\'s exciting English learning journey. Access interactive lessons, games, and activities designed to make learning fun and effective.',
    keywords:
      'register MR.El-Fallah , start learning, create account, english education, children\'s platform, learning journey, educational registration',
    url: 'http://elmisterelfallah.com/register'
  },
  profile: {
    title: 'My MR.El-Fallah  Profile - Manage Your Child\'s Learning Journey',
    description:
      'Access and manage your MR.El-Fallah  account settings, track your child\'s learning progress, and customize their English learning experience through our comprehensive profile dashboard.',
    keywords:
      'MR.El-Fallah  profile, learning progress, account settings, learning customization, progress tracking, educational dashboard, learning management',
    url: 'http://elmisterelfallah.com/profile'
  },
  cart: {
    title: 'MR.El-Fallah  Shopping Cart - Select Your Child\'s English Courses',
    description:
      'Review and manage your selected English courses in your MR.El-Fallah  shopping cart. Choose from our wide range of interactive lessons and activities for your child\'s learning journey.',
    keywords:
      'MR.El-Fallah  cart, course selection, english courses, learning materials, course checkout, educational purchases, learning resources',
    url: 'http://elmisterelfallah.com/cart'
  }
};
