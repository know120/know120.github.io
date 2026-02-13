import Button from "../components/common/Button"

export default function Tools() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="md:text-7xl text-3xl lg:text-8xl font-bold text-center text-white relative z-20">Tools</h1>
      <div className="w-[40rem] h-30 relative">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
      </div>
      <div className="flex justify-center items-center gap-4">
        <Button text="Design"
          onClick={() => window.location.href = '/#/tools/design'} />

        <Button text="Notes"
          onClick={() => window.location.href = '/#/tools/note'} />

        <Button text="Ad Library"
          onClick={() => window.location.href = '/#/tools/ad-library'} />

        <Button text="Token Usage"
          onClick={() => window.location.href = '/#/tools/token-usage'} />

        <Button text="AI Interview"
          onClick={() => window.location.href = '/#/tools/ai-interview'} />

      </div>
    </div>
  )
}