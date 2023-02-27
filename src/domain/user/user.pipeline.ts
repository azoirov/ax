import { PipelineStage, Types } from 'mongoose';
import calcRate from '@/pipelines/rate.pipeline';

class UserPipeline {
  public getUsers = (limit: number, page: number): PipelineStage[] => {
    return [
      {
        $facet: {
          data: [
            ...calcRate(),
            { $limit: limit },
            { $skip: limit * (page - 1) },
          ],
          resultCount: [
            {
              $count: 'count',
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $addFields: {
          totalCount: {
            $sum: [
              {
                $first: '$totalCount.count',
              },
              0,
            ],
          },
          resultCount: {
            $sum: [
              {
                $first: '$resultCount.count',
              },
              0,
            ],
          },
          currentPage: page,
          limit: limit,
        },
      },
      {
        $addFields: {
          limit: {
            $cond: ['$limit', '$limit', '$resultCount'],
          },
        },
      },
      {
        $addFields: {
          pagesCount: {
            $ceil: {
              $divide: ['$resultCount', '$limit'],
            },
          },
        },
      },
    ]
  }
}

export default UserPipeline