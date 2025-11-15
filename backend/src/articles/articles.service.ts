import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article> {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      authorId,
      slug: createArticleDto.slug || this.generateSlug(createArticleDto.title),
    });
    return await this.articlesRepository.save(article);
  }

  async findAll(includeDrafts: boolean = false): Promise<Article[]> {
    const queryBuilder = this.articlesRepository.createQueryBuilder('article');
    
    if (!includeDrafts) {
      queryBuilder.where('article.draft = :draft', { draft: false });
    }
    
    return await queryBuilder
      .orderBy('article.date', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { slug } });
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    if (updateArticleDto.title && !updateArticleDto.slug) {
      article.slug = this.generateSlug(updateArticleDto.title);
    }
    return await this.articlesRepository.save(article);
  }

  async remove(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

