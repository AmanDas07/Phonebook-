import { Controller, Get, Post, Body, Request, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private contactsService: ContactsService) { }

    @Post()
    async create(@Body() contactData: any, @Request() req) {
        console.log("Creating contact for userId:", req.user.userId);
        return this.contactsService.create(contactData, req.user.userId);
    }

    @Get()
    async findAll(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
        console.log("Fetching contacts for userId:", req.user.userId);
        return this.contactsService.findAll(req.user.userId, page, limit);
    }

    @Get('search')
    async search(@Request() req, @Query('query') query: string) {
        console.log("Searching contacts for userId:", req.user.userId);
        return this.contactsService.search(req.user.userId, query);
    }
}
