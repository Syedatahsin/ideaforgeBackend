import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import categoryrouters from '../modules/categories/categories.route';
import userrouter from '../modules/user/user.route';
import { IdeaRoutes } from '../modules/ideas/ideas.route';
import { AttachmentRoutes } from '../modules/attachments/attachments.route';
import { CommentRoutes } from '../modules/comments/comments.route';
import { VoteRoutes } from '../modules/votes/votes.route';
import { FavoriteRoutes } from '../modules/favorites/favorites.route';
import { ReportRoutes } from '../modules/reports/reports.route';
import { SupportTicketRoutes } from '../modules/supportTickets/supportTickets.route';
import { ReviewRoutes } from '../modules/reviews/reviews.route';
import { NewsletterRoutes } from '../modules/newsletter/newsletter.route';

const router = Router();

// Modular Route Mappings
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: categoryrouters,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/users',
    route: userrouter,
  },
  {
    path: '/ideas',
    route: IdeaRoutes,
  },
  {
    path: '/attachments',
    route: AttachmentRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/votes',
    route: VoteRoutes,
  },
  {
    path: '/favorites',
    route: FavoriteRoutes,
  },
  {
    path: '/reports',
    route: ReportRoutes,
  },
  {
    path: '/tickets',
    route: SupportTicketRoutes,
  },
  {
    path: '/newsletter',
    route: NewsletterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
