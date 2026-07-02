import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import categoriesRouter from "./categories.js";
import searchRouter from "./search.js";
import watchlistRouter from "./watchlist.js";
import continueWatchingRouter from "./continueWatching.js";
import adminRouter from "./admin.js";
import featuredRouter from "./featured.js";
import episodesRouter from "./episodes.js";
import { createContentRouter } from "./content.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/movies", createContentRouter("movie"));
router.use("/anime", createContentRouter("anime"));
router.use("/tv", createContentRouter("tv"));
router.use("/categories", categoriesRouter);
router.use("/search", searchRouter);
router.use("/watchlist", watchlistRouter);
router.use("/continue-watching", continueWatchingRouter);
router.use("/admin", adminRouter);
router.use("/featured", featuredRouter);
router.use("/", episodesRouter);

export default router;
