import { Controller, Get, Post, Body, Req } from '@nestjs/common';

@Controller('todo')
export class TodoController {
    private todo: string[] = ['T1', 'T2'];
    @Get()
    findAll() {
        return this.todo;
    }

    @Post()
    async create(@Body() item) {
        await this.todo.push(item.value);
    }
}
