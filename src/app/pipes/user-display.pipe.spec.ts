import { UserDisplayPipe } from "./user-display.pipe"

describe('UserDisplayPipe', () => {
    it('create an instance', () => {
        const pipe = new UserDisplayPipe();
        expect(pipe).toBeTruthy();
    });
});