# PC Builder Website ReadMe

## Overview

This is a PC Builder website developed using Next.js, a React framework. The website allows users to browse and select PC components to build their own custom PC. It includes features like a Home page displaying featured products, category sections, product detail pages, and a PC Builder tool. The PC Builder page is a protected route accessible only to logged-in users, and user authentication is implemented using NextAuth with social login providers like Google/Github.

## Features

1. **Navbar**: The website has a clean and straightforward navigation bar with a "PC Builder" button that redirects users to the PC Builder page. It also includes a "Categories" dropdown, enabling users to browse products by different categories.

2. **Home Page**: The Home page features 10 random PC components as "Featured Products" in card format. Each product card displays essential details like image, product name, category, price, availability status, and rating. Users can click on the product cards to access the product detail page.

3. **Featured Category Sections**: There are 6 clickable "Featured Categories" on the Home page, each leading to a separate page displaying at least 3 products of that category. Users can click on these product cards to view their details.

4. **Product Detail Page**: The product detail page shows comprehensive information about a specific PC component. It includes details such as image, product name, category, availability status, price, description, key features, individual rating, average rating, and reviews.

5. **PC Builder Page**: The PC Builder page is a server-side rendered (SSR) page that allows users to select PC components for their custom build. The page has sections for CPU, Motherboard, RAM, Power Supply Unit, Storage Device, and Monitor. Users can choose components from each section, and the selected components are displayed below. The "Complete Build" button becomes active only after adding at least 5-6 components.

6. **Redux**: To manage the state of the selected components in the PC Builder page, Redux or Context API is used to create a central store.

7. **Protected/Private Route**: The PC Builder page is a protected route, accessible only to logged-in users. NextAuth is implemented with social login providers (Google/Github) for user authentication.

8. **Success Alert**: Clicking on the "Complete Build" button displays a success alert.

9. **Hero Section and Footer**: The Home page includes a hero section/banner section and a footer for better user experience and aesthetics.

10. **Responsiveness**: The entire application is designed to be responsive for both mobile and desktop devices, ensuring an enjoyable user experience across all devices.

## Instructions to Run the Project

1. Clone the repository to your local machine.

2. Install the required dependencies using the package manager of your choice (npm or yarn).

3. Configure the NextAuth settings and set up social login providers (Google/Github) for user authentication.

4. Set up the backend to handle user authentication and protect the PC Builder page.

5. Create the necessary database and API endpoints to manage user data and user-selected components.

6. Run the development server using the appropriate command (e.g., "npm run dev" or "yarn dev").

7. Access the website on your preferred browser by navigating to the specified local URL (e.g., "localhost:3000").

8. Explore the website, browse through PC components, and use the PC Builder tool to build your custom PC.

## Conclusion

The PC Builder website is a user-friendly platform that allows users to easily build their custom PCs by selecting desired components. The website provides a smooth and intuitive experience with features like featured products, category sections, product detail pages, and a PC Builder tool. The implementation of user authentication using NextAuth adds an extra layer of security and personalization to the platform. Enjoy building your dream PC!
