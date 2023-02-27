import { PipelineStage, Types } from 'mongoose';
import calcRate from '@/pipelines/rate.pipeline';

class PostPipeline {
  public getPosts = (limit: number, page: number): PipelineStage[] => {
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

  public getUserRate = (userId: string): PipelineStage[] => {
    return [
      {
        $match: {
          author: new Types.ObjectId(userId)
        }
      },
      ...calcRate(),
      {
        $group: {
          _id: {
            $sum: "$rate"
          }
        }
      }
    ]
  }

  public getPostsByUser = (userId: string, limit: number, page: number): PipelineStage[] => {
    return [
      {
        $facet: {
          data: [
            {
              $match: {
                author: new Types.ObjectId(userId)
              }
            },
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

  public getById = (id: string): PipelineStage[] => {
    return [
      {
        $match: {
          _id: new Types.ObjectId(id)
        }
      },
      ...calcRate()
    ]
  }
}

export default PostPipeline