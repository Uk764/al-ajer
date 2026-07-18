import { Request, Response } from 'express';
import Banner from '../models/Banner';

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create banner', error });
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banners', error });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banner', error });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update banner', error });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete banner', error });
  }
};
