import express from 'express';

import {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob,
} from '../controllers/jobs';

const router = express.Router();

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

export = router;
