export enum RestrictionType {
    AllowAddress = 0x01,
    AllowMosaic = 0x02,
    AllowTransaction = 0x04,
    Sentinel = 0x05,
    BlockAddress = (0x80 + 0x01),
    BlockMosaic = (0x80 + 0x02),
    BlockTransaction = (0x80 + 0x04),
}
