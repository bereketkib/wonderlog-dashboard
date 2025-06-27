# Wonderlog Dashboard

A modern content management dashboard for authors of the Wonderlog blogging platform, built with Next.js and Tailwind CSS.

## Related Repositories

- [Wonderlog API](https://github.com/bereketkib/wonderlog-api) - Backend API
- [Wonderlog Web](https://github.com/bereketkib/wonderlog-web) - Main web application

## Features

- **Author Dashboard**

  - Overview statistics
  - Post analytics
  - Comment management
  - View tracking

- **Content Management**

  - Create and edit posts
  - Rich text editor with formatting
  - Draft/publish workflow
  - Post preview
  - Bulk actions

- **Comment System**

  - Comment moderation
  - Bulk comment management
  - Comment analytics
  - User interaction tracking

- **Analytics Dashboard**
  - Post performance metrics
  - View counts
  - Comment statistics
  - Real-time updates

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Editor:** TipTap
- **Icons:** Heroicons, Lucide
- **State Management:** React Context
- **HTTP Client:** Axios

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/bereketkib/wonderlog-dashboard.git
cd wonderlog-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Required environment variables:

```env
NEXT_PUBLIC_API_URL="your-api-url"
NEXT_PUBLIC_WEB_URL="your-web-url"
```

4. Start the development server

```bash
npm run dev
```

## Project Structure

```plaintext
src/
├── app/                # Next.js app router pages
│   ├── dashboard/     # Dashboard routes
│   ├── api/          # API routes
│   └── layout.tsx    # Root layout
├── components/       # Reusable components
│   ├── ui/          # UI components
│   └── RichTextEditor.tsx
├── context/         # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── services/        # API services
└── styles/         # Global styles
```

## Key Features

### Dashboard Overview

- Total posts count
- Published vs draft posts
- Recent comments
- View statistics
- Quick actions

### Post Management

- Rich text editor
- Draft/publish toggle
- Content validation
- Image handling
- Post preview

### Comment Moderation

- Approve/reject comments
- Bulk actions
- User management
- Spam protection

### Theme Support

- Light/dark mode
- System preference sync
- Persistent settings
- Smooth transitions

## Contributing

1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Bereket Kibreab

## Acknowledgments

- Next.js team
- TailwindCSS team
- TipTap team

