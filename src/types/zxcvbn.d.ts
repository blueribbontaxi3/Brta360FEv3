declare module 'zxcvbn' {
  interface ZXCVBNFeedback {
    warning: string;
    suggestions: string[];
  }

  interface ZXCVBNResult {
    score: number;
    feedback: ZXCVBNFeedback;
  }

  export default function zxcvbn(password: string): ZXCVBNResult;
}
