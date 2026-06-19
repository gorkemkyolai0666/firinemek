import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.recipesService.findAll(req.user.bakeryId);
  }

  @Post()
  create(@Body() dto: CreateRecipeDto, @Request() req: any) {
    return this.recipesService.create(dto, req.user.bakeryId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto, @Request() req: any) {
    return this.recipesService.update(id, dto, req.user.bakeryId);
  }
}
