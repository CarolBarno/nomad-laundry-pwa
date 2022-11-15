import { ProgressColorDirective } from "./progress-color.directive";

let elRefMock = {
  nativeElement: document.createElement('style')
};

describe('ProgressColorDirective', () => {
  it('should create an instance', () => {
    const directive = new ProgressColorDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
