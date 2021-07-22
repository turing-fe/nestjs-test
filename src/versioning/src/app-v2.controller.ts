import { Controller, Get } from '@nestjs/common'

@Controller({
  version: '2'
})
export class AppV2Controller {
  @Get('/')
  helloWorld() {
    return 'Hello World V2!'
  }

  @Get('/:param/hello')
  paramV1() {
    return 'Parameter V2!'
  }
}
