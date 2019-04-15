export default interface ReadingSetting {
  playOnClick: boolean,
  rate: number,
  pitch: number,
}
export type Play = 'none' | 'click' | 'select';