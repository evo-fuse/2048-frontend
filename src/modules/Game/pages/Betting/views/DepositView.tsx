import { Select } from "../../../../../components";
import { Images } from "../../../../../assets/images";

export const DepositView = () => {
    return <div className="w-full h-full text-white grid grid-cols-2 gap-4">
        <div className="w-full h-full p-8 border border-white/10 rounded-lg bg-gray-800/40">
            <h2 className="text-2xl font-bold pb-8">Deposit Crypto</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-white/70 text-sm font-medium">Deposit Currency</label>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
                            <img src={Images.USDT} alt="USDT" className="w-6 h-6" />USDT
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
                            <img src={Images.USDC} alt="USDC" className="w-6 h-6" />USDC
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-white/70 text-sm font-medium">Select Network</label>
                    <div className="w-full flex items-center justify-between p-2 gap-2 border rounded-lg border-white/10">
                        <Select
                            className="max-w-min"
                            options={[
                                {
                                    value: "Fuse",
                                    label:
                                        <div className="flex items-center gap-2">
                                            <img src={Images.FUSE} alt="FUSE" className="w-6 h-6 rounded-full" />Fuse
                                        </div>
                                },
                                {
                                    value: "Ethereum",
                                    label:
                                        <div className="flex items-center gap-2">
                                            <img src={Images.ETH} alt="ETH" className="w-6 h-6 rounded-full" />Ethereum
                                        </div>
                                },
                                {
                                    value: "Binance",
                                    label:
                                        <div className="flex items-center gap-2">
                                            <img src={Images.BNB} alt="BNB" className="w-6 h-6 rounded-full" />Binance
                                        </div>
                                },
                                {
                                    value: "Polygon",
                                    label:
                                        <div className="flex items-center gap-2">
                                            <img src={Images.POL} alt="POL" className="w-6 h-6 rounded-full" />Polygon
                                        </div>
                                },
                            ]}
                            value={"Fuse"}
                            onChange={(value) => {
                                console.log(value);
                            }}
                        />
                        <div className="flex flex-col items-end">
                            <label className="text-white/70 text-sm font-medium">amount</label>
                            <input value={100} className="bg-transparent border-none outline-none text-right" />
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="w-full h-full p-8 border border-white/10 rounded-lg">
                <h2 className="text-2xl font-bold">Deposit Status</h2>
            </div>
        </div>;
};