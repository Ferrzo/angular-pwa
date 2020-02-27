import { Controller, Get, Post, Body, Req } from '@nestjs/common';

@Controller('todo')
export class TodoController {
    private todo: any[] = [];
    @Get()
    findAll() {
        return this.todo;
    }

    @Post()
    async create(@Body() item) {
        if (Array.isArray(item.value)) {
            await (this.todo = this.todo.concat(item.value));
        } else {
            await this.todo.push(item.value);
        }
    }
}
