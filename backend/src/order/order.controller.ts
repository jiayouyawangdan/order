import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderSrv: OrderService) {}

  @Get('')
  listOrder(@Body() body: any) {
    return this.orderSrv.listOrder(body);
  }
  @Get('/pagination/:pageNumber?/:keyword?')
  listOrderWithPagination(
    @Param('pageNumber') pageNumber: string,
    @Param('keyword') keyword: string,
  ) {
    return this.orderSrv.listOrderWithPagination(pageNumber, keyword);
  }

  @Delete('')
  deleteOrder(@Body() body: any) {
    return this.orderSrv.delOrder(body);
  }

  @Put('')
  updateOrder(@Body() body: any) {
    return this.orderSrv.updateOrder(body);
  }

  @Post('')
  addOrder(@Body() body: any) {
    return this.orderSrv.addOrder(body);
  }
}
