package com.lljjcoder.citypickerview.model;

import java.util.List;

/**
 * Created by Administrator on 2016/8/3.
 */
public class JsonProvinceBean {


    /**
     * name : 广东
     * sub : [{"name":"广州","sub":[{"name":"越秀区"},{"name":"荔湾区"},{"name":"海珠区"},{"name":"天河区"},{"name":"白云区"},{"name":"黄埔区"},{"name":"番禺区"},{"name":"花都区"},{"name":"南沙区"},{"name":"萝岗区"},{"name":"增城市"},{"name":"从化市"},{"name":"其他"}],"type":0},{"name":"深圳","sub":[{"name":"福田区"},{"name":"罗湖区"},{"name":"南山区"},{"name":"宝安区"},{"name":"龙岗区"},{"name":"盐田区"},{"name":"其他"}],"type":0},{"name":"珠海","sub":[{"name":"香洲区"},{"name":"斗门区"},{"name":"金湾区"},{"name":"其他"}],"type":0},{"name":"汕头","sub":[{"name":"金平区"},{"name":"濠江区"},{"name":"龙湖区"},{"name":"潮阳区"},{"name":"潮南区"},{"name":"澄海区"},{"name":"南澳县"},{"name":"其他"}],"type":0},{"name":"韶关","sub":[{"name":"浈江区"},{"name":"武江区"},{"name":"曲江区"},{"name":"乐昌市"},{"name":"南雄市"},{"name":"始兴县"},{"name":"仁化县"},{"name":"翁源县"},{"name":"新丰县"},{"name":"乳源瑶族自治县"},{"name":"其他"}],"type":0},{"name":"佛山","sub":[{"name":"禅城区"},{"name":"南海区"},{"name":"顺德区"},{"name":"三水区"},{"name":"高明区"},{"name":"其他"}],"type":0},{"name":"江门","sub":[{"name":"蓬江区"},{"name":"江海区"},{"name":"新会区"},{"name":"恩平市"},{"name":"台山市"},{"name":"开平市"},{"name":"鹤山市"},{"name":"其他"}],"type":0},{"name":"湛江","sub":[{"name":"赤坎区"},{"name":"霞山区"},{"name":"坡头区"},{"name":"麻章区"},{"name":"吴川市"},{"name":"廉江市"},{"name":"雷州市"},{"name":"遂溪县"},{"name":"徐闻县"},{"name":"其他"}],"type":0},{"name":"茂名","sub":[{"name":"茂南区"},{"name":"茂港区"},{"name":"化州市"},{"name":"信宜市"},{"name":"高州市"},{"name":"电白县"},{"name":"其他"}],"type":0},{"name":"肇庆","sub":[{"name":"端州区"},{"name":"鼎湖区"},{"name":"高要市"},{"name":"四会市"},{"name":"广宁县"},{"name":"怀集县"},{"name":"封开县"},{"name":"德庆县"},{"name":"其他"}],"type":0},{"name":"惠州","sub":[{"name":"惠城区"},{"name":"惠阳区"},{"name":"博罗县"},{"name":"惠东县"},{"name":"龙门县"},{"name":"其他"}],"type":0},{"name":"梅州","sub":[{"name":"梅江区"},{"name":"兴宁市"},{"name":"梅县"},{"name":"大埔县"},{"name":"丰顺县"},{"name":"五华县"},{"name":"平远县"},{"name":"蕉岭县"},{"name":"其他"}],"type":0},{"name":"汕尾","sub":[{"name":"城区"},{"name":"陆丰市"},{"name":"海丰县"},{"name":"陆河县"},{"name":"其他"}],"type":0},{"name":"河源","sub":[{"name":"源城区"},{"name":"紫金县"},{"name":"龙川县"},{"name":"连平县"},{"name":"和平县"},{"name":"东源县"},{"name":"其他"}],"type":0},{"name":"阳江","sub":[{"name":"江城区"},{"name":"阳春市"},{"name":"阳西县"},{"name":"阳东县"},{"name":"其他"}],"type":0},{"name":"清远","sub":[{"name":"清城区"},{"name":"英德市"},{"name":"连州市"},{"name":"佛冈县"},{"name":"阳山县"},{"name":"清新县"},{"name":"连山壮族瑶族自治县"},{"name":"连南瑶族自治县"},{"name":"其他"}],"type":0},{"name":"东莞","sub":[],"type":0},{"name":"中山","sub":[],"type":0},{"name":"潮州","sub":[{"name":"湘桥区"},{"name":"潮安县"},{"name":"饶平县"},{"name":"其他"}],"type":0},{"name":"揭阳","sub":[{"name":"榕城区"},{"name":"普宁市"},{"name":"揭东县"},{"name":"揭西县"},{"name":"惠来县"},{"name":"其他"}],"type":0},{"name":"云浮","sub":[{"name":"云城区"},{"name":"罗定市"},{"name":"云安县"},{"name":"新兴县"},{"name":"郁南县"},{"name":"其他"}],"type":0},{"name":"其他"}]
     * type : 1
     */

    private String name;
    private int type;
    /**
     * name : 广州
     * sub : [{"name":"越秀区"},{"name":"荔湾区"},{"name":"海珠区"},{"name":"天河区"},{"name":"白云区"},{"name":"黄埔区"},{"name":"番禺区"},{"name":"花都区"},{"name":"南沙区"},{"name":"萝岗区"},{"name":"增城市"},{"name":"从化市"},{"name":"其他"}]
     * type : 0
     */

    private List<SubBean> sub;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public List<SubBean> getSub() {
        return sub;
    }

    public void setSub(List<SubBean> sub) {
        this.sub = sub;
    }

    public static class SubBean {
        private String name;
        private int type;
        /**
         * name : 越秀区
         */

        private List<SubBeans> sub;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getType() {
            return type;
        }

        public void setType(int type) {
            this.type = type;
        }

        public List<SubBeans> getSub() {
            return sub;
        }

        public void setSub(List<SubBeans> sub) {
            this.sub = sub;
        }

        public static class SubBeans {
            private String name;

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }
        }
    }
}
