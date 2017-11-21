
DING_DING_ROOT=/Applications/钉钉.app/Contents/Resources/app.nw/web_content

if [ ! -f $DING_DING_ROOT/index.html ]; then
    echo "$DING_DING_ROOT/index.html not found!"
    exit 1;
fi

cp ding_interceptor.js $DING_DING_ROOT/assets/

sed -i.bak '/<script src=".\/assets\/ding_interceptor.js"><\/script>/d' $DING_DING_ROOT/index.html

sed -i.bak '/<script src=".\/assets\/vendor.js"><\/script>/i\
<script src=".\/assets\/ding_interceptor.js"><\/script>
' $DING_DING_ROOT/index.html
