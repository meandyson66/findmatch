package com.meandyson.findmatch;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    private static final String START_URL = "https://appassets.androidplatform.net/index.html";
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        final WebViewAssetLoader assetLoader =
                new WebViewAssetLoader.Builder()
                        .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
                        .build();

        webView.setWebViewClient(
                new WebViewClient() {
                    @Override
                    public WebResourceResponse shouldInterceptRequest(
                            WebView view, WebResourceRequest request) {
                        return assetLoader.shouldInterceptRequest(request.getUrl());
                    }

                    @Override
                    public void onPageFinished(WebView view, String url) {
                        view.evaluateJavascript(
                                "document.documentElement.classList.add('android-app')",
                                null
                        );
                    }
                }
        );
        webView.setWebChromeClient(new WebChromeClient());
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        setContentView(webView);
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }
}