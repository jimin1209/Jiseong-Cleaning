"use client";

import Script from "next/script";
import { useCallback, useState } from "react";

type MapEmbedsProps = {
  address: string;
  naverHref: string;
  kakaoHref: string;
  naverKey?: string;
  kakaoKey?: string;
};

type LoadState = "loading" | "ready" | "error";

type NaverMaps = {
  Map: new (element: HTMLElement, options: { center: unknown; zoom: number }) => unknown;
  LatLng: new (latitude: number, longitude: number) => unknown;
  Marker: new (options: { map: unknown; position: unknown }) => unknown;
  Service: {
    Status: { OK: string };
    geocode: (
      options: { query: string },
      callback: (status: string, response: { v2?: { addresses?: Array<{ x: string; y: string }> } }) => void,
    ) => void;
  };
};

type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (latitude: number, longitude: number) => unknown;
  Map: new (element: HTMLElement, options: { center: unknown; level: number }) => unknown;
  Marker: new (options: { map: unknown; position: unknown }) => unknown;
  services: {
    Status: { OK: string };
    Geocoder: new () => {
      addressSearch: (
        address: string,
        callback: (result: Array<{ x: string; y: string }>, status: string) => void,
      ) => void;
    };
  };
};

declare global {
  interface Window {
    naver?: { maps: NaverMaps };
    kakao?: { maps: KakaoMaps };
  }
}

function MapFallback({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-tint px-6 text-center">
      <div>
        <p className="text-sm leading-6 text-muted">지도를 불러오지 못했습니다.</p>
        <a className="mt-3 inline-flex font-bold text-navy underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
          {label}에서 보기
        </a>
      </div>
    </div>
  );
}

export function MapEmbeds({ address, naverHref, kakaoHref, naverKey, kakaoKey }: MapEmbedsProps) {
  const [naverState, setNaverState] = useState<LoadState>(naverKey ? "loading" : "error");
  const [kakaoState, setKakaoState] = useState<LoadState>(kakaoKey ? "loading" : "error");

  const initializeNaver = useCallback(() => {
    const maps = window.naver?.maps;
    const element = document.getElementById("naver-map");
    if (!maps || !element) return setNaverState("error");

    maps.Service.geocode({ query: address }, (status, response) => {
      const result = response.v2?.addresses?.[0];
      if (status !== maps.Service.Status.OK || !result) return setNaverState("error");
      const position = new maps.LatLng(Number(result.y), Number(result.x));
      const map = new maps.Map(element, { center: position, zoom: 17 });
      new maps.Marker({ map, position });
      setNaverState("ready");
    });
  }, [address]);

  const initializeKakao = useCallback(() => {
    const maps = window.kakao?.maps;
    const element = document.getElementById("kakao-map");
    if (!maps || !element) return setKakaoState("error");

    maps.load(() => {
      const geocoder = new maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        const first = result[0];
        if (status !== maps.services.Status.OK || !first) return setKakaoState("error");
        const position = new maps.LatLng(Number(first.y), Number(first.x));
        const map = new maps.Map(element, { center: position, level: 3 });
        new maps.Marker({ map, position });
        setKakaoState("ready");
      });
    });
  }, [address]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="overflow-hidden rounded-brand border border-line bg-white shadow-card">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="font-extrabold text-navy">네이버 지도</h2>
          <a className="text-sm font-bold text-sky hover:underline" href={naverHref} target="_blank" rel="noreferrer">크게 보기</a>
        </div>
        <div className="relative h-80 border-t border-line">
          <div id="naver-map" className="h-full w-full" aria-label={`${address} 네이버 지도`} />
          {naverState === "loading" && <div className="absolute inset-0 grid place-items-center bg-tint text-sm text-muted">지도를 불러오는 중입니다.</div>}
          {naverState === "error" && <div className="absolute inset-0"><MapFallback href={naverHref} label="네이버 지도" /></div>}
        </div>
      </article>

      <article className="overflow-hidden rounded-brand border border-line bg-white shadow-card">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="font-extrabold text-navy">카카오맵</h2>
          <a className="text-sm font-bold text-sky hover:underline" href={kakaoHref} target="_blank" rel="noreferrer">크게 보기</a>
        </div>
        <div className="relative h-80 border-t border-line">
          <div id="kakao-map" className="h-full w-full" aria-label={`${address} 카카오맵`} />
          {kakaoState === "loading" && <div className="absolute inset-0 grid place-items-center bg-tint text-sm text-muted">지도를 불러오는 중입니다.</div>}
          {kakaoState === "error" && <div className="absolute inset-0"><MapFallback href={kakaoHref} label="카카오맵" /></div>}
        </div>
      </article>

      {naverKey && <Script src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(naverKey)}&submodules=geocoder`} strategy="afterInteractive" onLoad={initializeNaver} onError={() => setNaverState("error")} />}
      {kakaoKey && <Script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoKey)}&libraries=services&autoload=false`} strategy="afterInteractive" onLoad={initializeKakao} onError={() => setKakaoState("error")} />}
    </div>
  );
}
